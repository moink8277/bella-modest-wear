import { Link, Outlet } from 'react-router-dom';
import Container from '@/components/ui/Container';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-ivory">
            <header className="py-6">
                <Container className="flex justify-center">
                    <Link to="/" className="font-display text-2xl text-espresso tracking-wide">
                        Bella Modest Wear
                    </Link>
                </Container>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 pb-12">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}