import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductsService {

  constructor(private prisma:PrismaService){}

  async create(data: CreateProductDto) {
    
    const product = await this.prisma.products.create({data});
    return product;
  }

  async findAll() {
    return await this.prisma.products.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new Error('Produto não está na nossa base de dados.');
    }

    return product

  }

  async update(id: string, data: UpdateProductDto) {

    const product = await this.prisma.products.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error('Produto não está na base de dados.');
    }

    const att = await this.prisma.products.update({
      where: {
        id:id,
      },
      data:{
        description:data.description,
        price:data.price,
        stock:data.stock,
      }
    })
    
    return att;
  }

  async remove(id: string) {

    const product = await this.prisma.products.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error('Produto não está na base de dados.');
    }

    const deleted = await this.prisma.products.delete({
      where:{
        id:id,
      }
    })
    return deleted;
  }

  async buyProduct(id:string){
    const product = await this.prisma.products.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error('Produto não está base de dados.');
  } 
    if (product.stock == 0){
      throw new Error('Produto não disponível no estoque.')
  }

  const attStock: UpdateProductDto = {
      "stock": product.stock - 1
  }

  return await this.update(id, attStock)
  }
}
