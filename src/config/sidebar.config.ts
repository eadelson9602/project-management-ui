export const sidebarConfig = {
  modules: [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      path: '/home',
      isExpanded: false,
      roles: ['admin', 'manager', 'developer'],
    },
    {
      name: 'Proyectos',
      icon: 'folder',
      path: '/projects',
      isExpanded: true,
      roles: ['admin', 'manager', 'developer'],
      children: [
        {
          name: 'Lista de Proyectos',
          path: '/projects',
          roles: ['admin', 'manager'],
        },
        {
          name: 'Gestión de Proyectos',
          path: '/projects/manage',
          roles: ['admin', 'manager'],
        },
      ],
    },
    {
      name: 'Tareas',
      icon: 'assignment',
      path: '/tasks',
      isExpanded: false,
      roles: ['admin', 'manager', 'developer'],
    },
    {
      name: 'Perfil',
      icon: 'person',
      path: '/profile',
      isExpanded: false,
      roles: ['admin', 'manager', 'developer'],
    },
    {
      name: 'Cerrar sesión',
      icon: 'logout',
      path: '/',
      isExpanded: false,
      roles: ['admin', 'manager', 'developer'],
    },
  ],
};
