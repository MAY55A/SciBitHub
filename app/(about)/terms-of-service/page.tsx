export default function TermsOfServicePage() {
    return (
        <div className="max-w-3xl mx-auto px-4 pt-16">
            <h1 className="text-3xl font-bold text-primary mb-6">Terms of Service</h1>
            <p className="mb-4 font-retro">
                By accessing or using SciBitHub, you agree to be bound by these terms. If you do not agree, you may not use the platform.
            </p>
            <ul className="list-disc pl-5 space-y-2 font-retro">
                <li>
                    <strong>User Responsibility:</strong> You are responsible for the content you share and for complying with applicable laws.
                </li>
                <li>
                    <strong>Project Ownership:</strong> Projects remain the intellectual property of their creators. SciBitHub does not claim ownership.
                </li>
                <li>
                    <strong>Community Conduct:</strong> Respectful communication is mandatory. Hate speech, harassment, or spam will not be tolerated.
                </li>
                <li>
                    <strong>Platform Integrity:</strong> Do not attempt to disrupt or exploit the platform or its users.
                </li>
                <li>
                    <strong>Eligibility:</strong> You must be at least 13 years old or the legal age in your country to use SciBitHub.
                </li>
                <li>
                    <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.
                </li>
                <li>
                    <strong>Content Removal:</strong> We reserve the right to remove content or suspend accounts that violate these terms.
                </li>
                <li>
                    <strong>Termination:</strong> SciBitHub may terminate or suspend access without prior notice if you violate the terms.
                </li>
                <li>
                    <strong>Modifications:</strong> These terms may be updated from time to time. Continued use implies acceptance of any changes.
                </li>
            </ul>
        </div>
    );
}