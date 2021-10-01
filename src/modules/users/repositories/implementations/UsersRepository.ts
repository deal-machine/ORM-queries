import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {

    return await this.repository
      .findOne({ where: { id: user_id }, relations: ['games'] }) as User;

  }

  // Complete usando raw query
  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository
      .query(`SELECT * FROM users as u ORDER BY u.first_name ASC`);

    return users;
  }

  // Complete usando raw query
  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository
      .query(`
            SELECT * from users
            WHERE first_name ILIKE LOWER($1)
            AND last_name ILIKE LOWER($2)
    `, [first_name, last_name]);
  }
}
