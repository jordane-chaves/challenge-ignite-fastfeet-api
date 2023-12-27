import { AuthenticateAdminUseCase } from '@/domain/account/application/use-cases/authenticate-admin'
import { AuthenticateDeliverymanUseCase } from '@/domain/account/application/use-cases/authenticate-deliveryman'
import { ChangeDeliverymanPasswordUseCase } from '@/domain/account/application/use-cases/change-deliveryman-password'
import { CreateAdminUseCase } from '@/domain/account/application/use-cases/create-admin'
import { CreateDeliverymanUseCase } from '@/domain/account/application/use-cases/create-deliveryman'
import { DeleteDeliverymanUseCase } from '@/domain/account/application/use-cases/delete-deliveryman'
import { EditDeliverymanUseCase } from '@/domain/account/application/use-cases/edit-deliveryman'
import { GetDeliverymanUseCase } from '@/domain/account/application/use-cases/get-deliveryman'
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
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller'
import { ChangeDeliverymanPasswordController } from './controllers/change-deliveryman-password.controller'
import { CreateAdminController } from './controllers/create-admin.controller'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeliverOrderController } from './controllers/deliver-order.controller'
import { EditDeliverymanController } from './controllers/edit-deliveryman.controller'
import { EditOrderController } from './controllers/edit-order.controller'
import { FetchCustomerOrdersController } from './controllers/fetch-customer-orders.controller'
import { FetchDeliverymanOrdersController } from './controllers/fetch-deliveryman-orders.controller'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { GetDeliverymanController } from './controllers/get-deliveryman.controller'
import { GetOrderController } from './controllers/get-order.controller'
import { PostOrderController } from './controllers/post-order.controller'
import { ReturnOrderController } from './controllers/return-order.controller'
import { UploadImageController } from './controllers/upload-image.controller'
import { WithdrawOrderController } from './controllers/withdraw-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateDeliverymanController,
    ChangeDeliverymanPasswordController,
    CreateAdminController,
    CreateDeliverymanController,
    CreateOrderController,
    DeleteDeliverymanController,
    DeleteOrderController,
    DeliverOrderController,
    EditDeliverymanController,
    EditOrderController,
    FetchCustomerOrdersController,
    FetchDeliverymanOrdersController,
    FetchNearbyOrdersController,
    GetOrderController,
    GetDeliverymanController,
    PostOrderController,
    ReturnOrderController,
    UploadImageController,
    WithdrawOrderController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    AuthenticateDeliverymanUseCase,
    ChangeDeliverymanPasswordUseCase,
    CreateAdminUseCase,
    CreateDeliverymanUseCase,
    CreateOrderUseCase,
    DeleteDeliverymanUseCase,
    DeleteOrderUseCase,
    DeliverOrderUseCase,
    EditDeliverymanUseCase,
    EditOrderUseCase,
    FetchCustomerOrdersUseCase,
    FetchDeliverymanOrdersUseCase,
    FetchNearbyOrdersUseCase,
    GetDeliverymanUseCase,
    GetOrderUseCase,
    PostOrderUseCase,
    ReturnOrderUseCase,
    UploadAndCreateImageUseCase,
    WithdrawOrderUseCase,
  ],
})
export class HttpModule {}
