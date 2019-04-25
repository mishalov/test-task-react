import { IFiltredUser } from '../module';

export const userToOption = (user: IFiltredUser) => ({ label: user.name, value: user.id });
