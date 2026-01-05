// Request notification permission when the app loads
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

// Check if browser supports notifications
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Send a browser notification
export const sendNotification = (title, body) => {
  if (!isNotificationSupported()) {
    console.log('Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      }
    });
  }
};

// Check tasks for upcoming reminders
export const checkReminders = (tasks) => {
  const now = new Date();
  const upcomingReminders = [];

  tasks.forEach((task) => {
    if (task.reminderTime && task.status === 'pending') {
      const reminderTime = new Date(task.reminderTime);
      const timeDiff = reminderTime - now;
      
      // Notify if reminder is within the next 5 minutes
      if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
        upcomingReminders.push(task);
        sendNotification(
          'Task Reminder',
          `Don't forget: ${task.title}`
        );
      }
    }
  });

  return upcomingReminders;
};

// Get all upcoming reminders (within 24 hours)
export const getUpcomingReminders = (tasks) => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return tasks.filter((task) => {
    if (!task.reminderTime || task.status === 'completed') {
      return false;
    }
    const reminderTime = new Date(task.reminderTime);
    return reminderTime >= now && reminderTime <= tomorrow;
  }).sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
};
