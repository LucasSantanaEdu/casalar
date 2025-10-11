'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GiTreehouse } from 'react-icons/gi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-black transition-colors">
      <div
        className="w-[70%] bg-cover bg-center hidden md:block"
        style={{ backgroundImage: 'url(/login.png)' }}
      ></div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="flex justify-center text-green-600 dark:text-green-400 text-5xl mb-4">
            <GiTreehouse />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-700 dark:text-green-300">
            CasaLar
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-8"
          >

            <div className="relative">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 transition-colors"
                placeholder="Email ou Usuário"
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-green-300 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500"
              >
                Email ou Usuário
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer h-10 w-full border border-green-400 dark:border-green-300 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-orange-500 pl-3 transition-colors"
                placeholder="Senha"
              />
              <label
                htmlFor="password"
                className="absolute left-3 -top-6 text-gray-700 dark:text-green-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-green-300 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-orange-500"
              >
                Senha
              </label>
            </div>


            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 transition"
              >
                Entrar
              </button>

              <button
                type="button"
                className="w-full border border-green-600 text-green-600 py-2 rounded hover:border-orange-500 hover:text-orange-500 dark:border-green-300 dark:text-green-300 dark:hover:border-orange-500 dark:hover:text-orange-500 transition"
              >
                Cadastrar
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-green-200 space-y-1">
              <p>
                Não tem uma conta?{' '}
                <a href="#" className="text-green-600 dark:text-green-300 hover:underline">
                  Criar conta
                </a>
              </p>
              <p>
                <a href="#" className="text-green-600 dark:text-green-300 hover:underline">
                  Entrar com Google
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
