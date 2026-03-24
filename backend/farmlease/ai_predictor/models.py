from django.conf import settings
from django.db import models


class CropPredictionHistory(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='crop_prediction_history',
	)

	mode = models.CharField(max_length=20, blank=True, default='')
	region = models.CharField(max_length=100, blank=True, default='')
	ph = models.FloatField(null=True, blank=True)
	nitrogen = models.FloatField(null=True, blank=True)
	phosphorus = models.FloatField(null=True, blank=True)
	potassium = models.FloatField(null=True, blank=True)
	rainfall = models.FloatField(null=True, blank=True)
	temperature = models.FloatField(null=True, blank=True)

	# Stored as returned by the AI service (list of recommendations)
	predictions = models.JSONField(default=list)

	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"CropPredictionHistory(user={self.user_id}, created_at={self.created_at})"
