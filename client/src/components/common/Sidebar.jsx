import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/medicines', label: 'Medicines' },
  { to: '/sales', label: 'Sales' },
  { to: '/reports', label: 'Reports' },
   
];

export default function Sidebar({ open, setOpen }) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      {/* Mobile sidebar overlay */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-30 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-56 bg-white shadow h-full flex flex-col">
                <button className="absolute top-2 right-2 p-2" onClick={() => setOpen(false)} aria-label="Close sidebar">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <nav className="flex flex-col gap-2 p-4 mt-8">
                  {links.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 ${isActive ? 'bg-blue-200 font-bold' : ''}`
                      }
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-0" aria-hidden="true" />
          </div>
        </Dialog>
      </Transition.Root>
      {/* Desktop sidebar */}
      <aside className="w-56 bg-white shadow h-screen sticky top-0 hidden md:block">
        <nav className="flex flex-col gap-2 p-4">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 ${isActive ? 'bg-blue-200 font-bold' : ''}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
} 