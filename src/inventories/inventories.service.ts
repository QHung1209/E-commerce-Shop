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

  async reservationInventory(productId: string, quantity: number, cartId: string) {
    const query = {
      product_id: productId,
      stock: { $gte: quantity }
    },
      updateSet = {
        $inc: {
          stock: -quantity
        },
        $push: {
          reservations: {
            quantity,
            cartId,
            createdIn: new Date()
          }
        }
      }
    return await this.inventoryModel.updateOne(query, updateSet)
  }


}
