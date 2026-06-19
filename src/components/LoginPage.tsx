import { FormEvent, useState } from 'react';
import { AlertCircle, LockKeyhole, QrCode, UserRound } from 'lucide-react';

interface LoginPageProps {
  errorMessage: string;
  onLogin: (credentials: { username: string; password: string }) => void;
}

export function LoginPage({ errorMessage, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin({
      username: username.trim(),
      password
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
        <div className="bg-slate-900 px-8 py-10 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <QrCode className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">QR Student Collector</h1>
          <p className="mt-3 text-sm text-slate-300">
            Sign in before accessing the QR scanner and Google Sheets workflow.
          </p>
        </div>

        <form className="space-y-5 px-8 py-8" onSubmit={handleSubmit}>
          <InputField
            icon={<UserRound className="h-4 w-4" />}
            label="Username"
            onChange={setUsername}
            type="text"
            value={username}
          />

          <InputField
            icon={<LockKeyhole className="h-4 w-4" />}
            label="Password"
            onChange={setPassword}
            type="password"
            value={password}
          />

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

interface InputFieldProps {
  icon: JSX.Element;
  label: string;
  onChange: (value: string) => void;
  type: 'password' | 'text';
  value: string;
}

function InputField({ icon, label, onChange, type, value }: InputFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500">
        <span className="text-slate-400">{icon}</span>
        <input
          className="w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          onChange={(event) => onChange(event.target.value)}
          required
          type={type}
          value={value}
        />
      </div>
    </label>
  );
}
