import { UserService } from "../../services/users.service";

const getUser = () => {
  const services = new UserService();
  return services.getUser();
}

export {
  getUser,
}