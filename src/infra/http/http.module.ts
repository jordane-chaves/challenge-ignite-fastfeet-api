import { AuthenticateAdminUseCase } from '@/domain/account/application/use-cases/authenticate-admin'
import { CreateAdminUseCase } from '@/domain/account/application/use-cases/create-admin'
import { CreateOrderUseCase } from '@/domain/order/application/use-cases/create-order'
import { DeleteOrderUseCase } from '@/domain/order/application/use-cases/delete-order'
import { DeliverOrderUseCase } from '@/domain/order/application/use-cases/deliver-order'
import { EditOrderUseCase } from '@/domain/order/application/use-cases/edit-order'
import { FetchCustomerOrdersUseCase } from '@/domain/order/application/use-cases/fetch-customer-orders'
import { FetchDeliverymanOrdersUseCase } from '@/domain/order/application/use-cases/fetch-deliveryman-orders'
import { FetchNearbyOrdersUseCase } from '@/domain/order/application/use-cases/fetch-nearby-orders'
import { GetOrderUseCase } from '@/domain/order/application/use-cases/get-order'
import { PostOrderUseCase } from '@/domain/order/application/use-cases/post-order'
import { ReturnOrderUseCase } from '@/domain/order/application/use-cases/return-order'
import { UploadAndCreateImageUseCase } from '@/domain/order/application/use-cases/upload-and-create-image'
import { WithdrawOrderUseCase } from '@/domain/order/application/use-cases/withdraw-order'
import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { CreateAdminController } from './controllers/create-admin.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeliverOrderController } from './controllers/deliver-order.controller'
import { EditOrderController } from './controllers/edit-order.controller'
import { FetchCustomerOrdersController } from './controllers/fetch-customer-orders.controller'
import { FetchDeliverymanOrdersController } from './controllers/fetch-deliveryman-orders.controller'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { GetOrderController } from './controllers/get-order.controller'
import { PostOrderController } from './controllers/post-order.controller'
import { ReturnOrderController } from './controllers/return-order.controller'
import { UploadImageController } from './controllers/upload-image.controller'
import { WithdrawOrderController } from './controllers/withdraw-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateAdminController,
    CreateAdminController,
    CreateOrderController,
    DeleteOrderController,
    DeliverOrderController,
    EditOrderController,
    FetchCustomerOrdersController,
    FetchDeliverymanOrdersController,
    FetchNearbyOrdersController,
    GetOrderController,
    PostOrderController,
    ReturnOrderController,
    UploadImageController,
    WithdrawOrderController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    CreateAdminUseCase,
    CreateOrderUseCase,
    DeleteOrderUseCase,
    DeliverOrderUseCase,
    EditOrderUseCase,
    FetchCustomerOrdersUseCase,
    FetchDeliverymanOrdersUseCase,
    FetchNearbyOrdersUseCase,
    GetOrderUseCase,
    PostOrderUseCase,
    ReturnOrderUseCase,
    UploadAndCreateImageUseCase,
    WithdrawOrderUseCase,
  ],
})
export class HttpModule {}
