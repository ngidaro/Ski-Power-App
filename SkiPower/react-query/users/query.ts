import { UserService } from "../../services/users.service";

const getUser = () => {
  const services = new UserService();
  return services.getUser().then((data) => data.data);
}

export {
  getUser,
}