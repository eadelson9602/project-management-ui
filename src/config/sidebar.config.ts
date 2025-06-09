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
          path: '/projects_manage/',
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
      name: 'Usuarios',
      icon: 'people',
      path: '/users',
      isExpanded: true,
      roles: ['admin', 'manager'],
      children: [
        {
          name: 'Lista de Usuarios',
          path: '/users',
          roles: ['admin', 'manager'],
        },
        {
          name: 'Gestión de Usuarios',
          path: '/users/manage',
          roles: ['admin', 'manager'],
        },
      ],
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
