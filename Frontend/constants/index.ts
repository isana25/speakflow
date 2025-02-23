export const sidebarLinks = [
  {
    imgURL: '/icons/Home.svg',
    route: '/',
    label: 'Home',
  },

  {
    imgURL: '/icons/upcoming.svg',
    route: '/upcoming',
    label: 'Upcoming',
  },
  {
    imgURL: '/icons/previous.svg',
    route: '/previous',
    label: 'Previous',
  },
  {
    imgURL: '/icons/Video.svg',
    route: '/recordings',
    label: 'Recordings',
  },
  {
    imgURL: '/icons/add-personal.svg',
    route: '/personal-room',
    label: 'Personal Room',
  },
  {
    label: 'Team Members',
    dropdown: true,
    teamMembers: [
      { name: 'Hassaan', linkedinURL: 'https://www.linkedin.com/in/hassaan/', avatar: '/images/avatar-1.jpeg' },
      { name: 'Sana', linkedinURL: 'https://www.linkedin.com/in/sana/', avatar: '/images/avatar-2.jpeg' },
      { name: 'Minal', linkedinURL: 'https://www.linkedin.com/in/minal/', avatar: '/images/avatar-3.png' },
      { name: 'Stephanie', linkedinURL: 'https://www.linkedin.com/in/stephanie/', avatar: '/images/avatar-4.png' }
    ]
  }
];

export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];
