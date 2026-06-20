import RegisterForm from '@/components/RegisterForm';
import ParticleBackground from '@/components/ParticleBackground';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
