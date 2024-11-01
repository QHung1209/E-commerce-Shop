import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class InventoriesService {
  constructor(@InjectModel(Inventory.name) private inventoryModel: SoftDeleteModel<InventoryDocument>) { }
  async create(createInventoryDto: CreateInventoryDto, shop: IUser) {

    return await this.inventoryModel.create({
      ...createInventoryDto, createdBy: {
        _id: shop._id,
        email: shop.email
      }
    })
  }

  findAll() {
    return `This action returns all inventories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
