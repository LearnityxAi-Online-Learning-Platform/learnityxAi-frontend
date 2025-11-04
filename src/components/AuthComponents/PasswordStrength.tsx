import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
    password: string;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
};

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const passwordStrength = calculatePasswordStrength(password);

    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Contains number', met: /[0-9]/.test(password) },
        { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(password) }
    ];

    return (
        <div className="space-y-2 mt-2">
            {/* Strength Bar */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Password Strength:</span>
                <span className={`text-xs font-semibold ${
                    passwordStrength.label === 'Weak' ? 'text-red-600' :
                    passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                }`}>
                    {passwordStrength.label}
                </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                />
            </div>

            {/* Requirements List */}
            <div className="space-y-1 mt-2">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        {req.met ? (
                            <Check size={12} className="text-green-600 flex-shrink-0" />
                        ) : (
                            <X size={12} className="text-red-600 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
