
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      authAdmin: true
    },
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/IndexPage.vue') },
      { path: 'Map', name: 'map', component: () => import('pages/Map.vue') },
      { path: 'Drivers', name: 'driver', component: () => import('pages/Drivers.vue') },
      { path: 'user-verified', name: 'userVerified', component: () => import('pages/UserVerified.vue') },
      { path: 'user-denied', name: 'userDenied', component: () => import('pages/userDenied.vue') },
      { path: 'Order', name: 'order', component: () => import('pages/Order.vue') },
      { path: 'PilihDriver/:guid', name: 'pilihDriver', component: () => import('pages/PilihDriver.vue') },
      { path: 'DaftarPesanan', name: 'daftarPesanan', component: () => import('pages/DaftarPesanan.vue') },
      { path: 'Vehicle', name: 'vehicle', component: () => import('pages/Vehicle.vue') },
      { path: 'Schedule', name: 'schedule', component: () => import('pages/Schedule.vue') },
      { path: 'Profile', name: 'profil', component: () => import('pages/Profile.vue') },
      { path: 'Profile/:guid', name: 'editProfile', component: () => import('pages/Profile.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('pages/Acces/Login.vue'),
    children: [
      { path: 'Login', name: 'login', component: () => import('pages/Acces/Login.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
