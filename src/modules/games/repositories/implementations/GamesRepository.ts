import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private repositoryUser: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.repositoryUser = getRepository(User);
  }

  // Complete usando query builder
  //should be able find a game by entire or partial given title
  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE :title", { title: `%${param}%` })
      .getMany();

    return games;
  }

  // Complete usando raw query
  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.query(`
    SELECT COUNT(*) FROM games
    `);
    return count;
  }

  // Complete usando query builder
  async findUsersByGameId(id: string): Promise<User[]> {
    const user = await this.repositoryUser
      .createQueryBuilder("user")
      .leftJoin("user.games", "games")
      .where("games.id = :id", { id })
      .getMany();

    // console.log(user);
    return user;
  }
}
