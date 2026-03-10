from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'name',
            'role',
            'phone_number',
            'address',
            'county',
            'id_number',
            'is_verified',
            'is_staff',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'is_verified', 'is_staff',
        ]


class SignupSerializer(serializers.ModelSerializer):
    """Serializer for user signup"""

    password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'role',
            'password',
            'password2',
            'first_name',
            'last_name',
            'address',
            'county',
            'id_number',
        ]

    def validate(self, attrs):
        password2 = attrs.get('password2')
        if password2 and attrs['password'] != password2:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        
        # Check for duplicate email
        if 'email' in attrs:
            email = attrs['email']
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    {"email": "A user with this email already exists."}
                )
        
        # Check for duplicate phone number
        if 'phone_number' in attrs:
            phone = attrs['phone_number']
            if User.objects.filter(phone_number=phone).exists():
                raise serializers.ValidationError(
                    {"phone_number": "A user with this phone number already exists."}
                )
        
        # Convert empty strings to None for optional unique fields
        if 'id_number' in attrs and not attrs['id_number']:
            attrs['id_number'] = None
        if 'address' in attrs and not attrs['address']:
            attrs['address'] = None
        if 'county' in attrs and not attrs['county']:
            attrs['county'] = None
            
        return attrs

    def create(self, validated_data):
        # Remove password2 from validated data
        validated_data.pop('password2', None)
        
        # Extract password before creating user
        password = validated_data.pop('password')
        
        # Generate unique username if not provided
        if not validated_data.get('username'):
            base_username = validated_data['email'].split('@')[0]
            username = base_username
            counter = 1
            
            # Ensure username is unique
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            validated_data['username'] = username
        
        # Create user with password
        user = User.objects.create_user(password=password, **validated_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer to include role and profile info."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token

    def create(self, validated_data):
        raise NotImplementedError

    def update(self, instance, validated_data):
        raise NotImplementedError


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""

    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
    )
    new_password2 = serializers.CharField(required=True, write_only=True)

    def create(self, validated_data):
        raise NotImplementedError

    def update(self, instance, validated_data):
        raise NotImplementedError

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."}
            )
        return attrs
