import { Paginated } from 'src/common/dtos/pagination.dto';
import { Cat } from '../cat.entity';

export class PaginatedCat extends Paginated<Cat> {}
