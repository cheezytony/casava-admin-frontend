import { Admin } from '~~/types/models';

export const getFullName = (user: Admin) => {
  if (!user) return;
  return `${user.first_name} ${user.last_name}`;
};

// export const get
