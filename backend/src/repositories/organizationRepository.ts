import { BaseRepository } from './baseRepository';
import { Organization } from '../models/organization';

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor() {
    super(Organization);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.model.findOne({ where: { slug } });
  }
}

export const organizationRepository = new OrganizationRepository();
