'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const currentPath = pathname || '/';

  return (
    <header className="bg-[#1F2833] border-b border-[#45A29E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0B0C10]">
                <span className="text-xl font-bold text-[#66FCF1]">A</span>
              </div>
              <span className="text-xl font-bold text-[#C5C6C7]">AnimeSocial</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/anime" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                Anime
              </Link>
              <Link href="/posts" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                Posts
              </Link>
              <Link href="/shop" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                Магазин
              </Link>
              {user?.is_admin && (
                <>
                  <Link href="/admin/anime" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                    Адмінка
                  </Link>
                  <Link href="/admin/products" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                    Товари
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/posts/new" className="px-4 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors">
                  Створити пост
                </Link>
                {user?.is_admin && (
                  <Link href="/admin/anime" className="px-4 py-2 rounded-lg border-2 border-[#66FCF1] text-[#66FCF1] font-semibold hover:bg-[#66FCF1] hover:text-[#0B0C10] transition-colors">
                    Створити аніме
                  </Link>
                )}
                <Link href="/profile" className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                  Профіль
                </Link>
              </>
            ) : (
              <>
                <Link href={`/login?next=${encodeURIComponent(currentPath)}`} className="text-[#C5C6C7] hover:text-[#66FCF1] transition-colors">
                  Увійти
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors">
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
