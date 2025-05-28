export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
            <p className="mb-4 font-retro">
                At SciBitHub, we value your privacy. This policy explains what data we collect, how we use it, and your rights.
            </p>
            <ul className="list-disc pl-5 space-y-2 font-retro">
                <li>
                    <strong>Minimal Data Collection:</strong> We only collect essential data required for account creation and functionality.
                </li>
                <li>
                    <strong>No Tracking:</strong> We do not use tracking cookies or third-party analytics services.
                </li>
                <li>
                    <strong>Contribution Control:</strong> All contributions are tied to your user ID but remain under your control.
                </li>
                <li>
                    <strong>Data Sharing:</strong> We do not sell or share your personal information with third parties.
                </li>
                <li>
                    <strong>Security:</strong> Data is stored securely via Supabase and protected by standard encryption protocols.
                </li>
                <li>
                    <strong>Account Deletion:</strong> You may request full deletion of your account and all associated data at any time by contacting support.
                </li>
                <li>
                    <strong>Email Usage:</strong> If you sign up with an email address, it will only be used for authentication and important platform updates.
                </li>
            </ul>
        </div>
    );
}