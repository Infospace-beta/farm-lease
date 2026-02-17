import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const ProfileSettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: 'James',
    lastName: 'Mwangi',
    email: 'james.mwangi@farmlease.co.ke',
    phone: '712 345 678',
    address: 'P.O. Box 402, Nakuru-Eldoret Highway, Rift Valley',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'person' },
    { id: 'bank', label: 'Bank Details', icon: 'account_balance' },
    { id: 'security', label: 'Security', icon: 'lock' },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-earth font-serif">
            Profile Settings
          </h2>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Manage your personal information, banking details for payouts, and account security.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'personal' && <PersonalInfoTab formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />}
            {activeTab === 'bank' && <BankDetailsTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Profile Completion</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary">85% Complete</span>
                <span className="text-xs text-slate-400">Step 3 of 4</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-slate-600">
                  <span className="material-symbols-outlined text-green-500 text-lg mr-2">
                    check_circle
                  </span>
                  Email Verified
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <span className="material-symbols-outlined text-green-500 text-lg mr-2">
                    check_circle
                  </span>
                  Phone Number Verified
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <span className="material-symbols-outlined text-slate-300 text-lg mr-2">
                    radio_button_unchecked
                  </span>
                  Add KRA PIN (Optional)
                </li>
              </ul>
            </div>

            {/* Data Privacy Notice */}
            <div className="rounded-2xl bg-blue-50 p-6 border border-blue-100">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 mt-0.5">
                  verified_user
                </span>
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Data Privacy</h4>
                  <p className="text-xs text-blue-800/80 mt-1">
                    Your personal data is encrypted and only shared with verified tenants upon
                    lease agreement signing. We comply with the Data Protection Act of Kenya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Personal Info Tab Component
const PersonalInfoTab = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      {/* Profile Photo Section */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
        <div className="relative group">
          <div
            className="h-24 w-24 rounded-full border-4 border-slate-50 overflow-hidden bg-slate-100 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAT6nH4nkwO8i4jHFK5OJrAVEUaX9KPD_3gQi9czBmAGggy60DZQqZZyqYfwKCSK6enG4geS-t5bUGzong4mgCJVYb-Rt85Mh3qTMguTY07o62eyGxoTFfLvC84usaEynp4Vpqs1iUZJTZg-3qhhFE73W8KGmfH8JIvaB-kgMw8EvMqUfh18UkKlBnIhTeTx4MhbOl3MSyD6lTb_0pTqdqN3O8Es4fGjvNpFA5QFqcmSXtQenx2B-heQbKC5IqtfVkyzgKndRfmhRp_")',
            }}
          ></div>
          <div className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white cursor-pointer hover:bg-primary-dark transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">edit</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">James Mwangi</h3>
          <p className="text-sm text-slate-500 mb-2">Farm Owner • Premium Member</p>
          <button className="text-sm font-medium text-primary hover:text-primary-dark hover:underline">
            Change profile photo
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-slate-900">
              First Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="given-name"
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-slate-900">
              Last Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="family-name"
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
              Email Address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900">
              Phone Number (M-Pesa enabled)
            </label>
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-500 sm:text-sm">KE +254</span>
              </div>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                autoComplete="tel"
                className="block w-full rounded-lg border-0 py-2.5 pl-20 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Used for transaction notifications and secure verification.
            </p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium leading-6 text-slate-900">
              Physical Address / Farm Location
            </label>
            <div className="mt-2">
              <textarea
                name="address"
                id="address"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-earth text-earth px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Bank Details Tab Component
const BankDetailsTab = () => {
  const [bankData, setBankData] = useState({
    bankName: 'Equity Bank Kenya',
    accountName: 'James Mwangi',
    accountNumber: '0123456789',
    branchName: 'Nakuru Branch',
    swiftCode: 'EQBLKENA',
  });

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Bank Account Details</h3>
        <p className="text-sm text-slate-500 mt-1">
          This account will be used for all withdrawal payouts from your earnings.
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium leading-6 text-slate-900">
            Bank Name
          </label>
          <div className="mt-2">
            <select
              id="bankName"
              name="bankName"
              value={bankData.bankName}
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            >
              <option>Equity Bank Kenya</option>
              <option>KCB Bank</option>
              <option>Cooperative Bank</option>
              <option>Absa Bank Kenya</option>
              <option>Standard Chartered</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="accountName" className="block text-sm font-medium leading-6 text-slate-900">
            Account Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={bankData.accountName}
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium leading-6 text-slate-900">
            Account Number
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={bankData.accountNumber}
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="branchName" className="block text-sm font-medium leading-6 text-slate-900">
              Branch Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="branchName"
                name="branchName"
                value={bankData.branchName}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="swiftCode" className="block text-sm font-medium leading-6 text-slate-900">
              SWIFT/BIC Code
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="swiftCode"
                name="swiftCode"
                value={bankData.swiftCode}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-earth text-earth px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
          >
            Update Bank Details
          </button>
        </div>
      </form>
    </div>
  );
};

// Security Tab Component
const SecurityTab = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Password &amp; Security</h3>
        <p className="text-sm text-slate-500 mt-1">
          Manage your password and enable two-factor authentication for enhanced security.
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium leading-6 text-slate-900">
            Current Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-slate-900">
            New Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-slate-900">
            Confirm New Password
          </label>
          <div className="mt-2">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">
                verified_user
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Add an extra layer of security to your account using SMS verification.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Enable
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-earth text-earth px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
