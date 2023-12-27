import { AuthenticateAdminUseCase } from '@/domain/account/application/use-cases/authenticate-admin'
import { AuthenticateDeliverymanUseCase } from '@/domain/account/application/use-cases/authenticate-deliveryman'
import { AuthenticateRecipientUseCase } from '@/domain/account/application/use-cases/authenticate-recipient'
import { ChangeDeliverymanPasswordUseCase } from '@/domain/account/application/use-cases/change-deliveryman-password'
import { ChangeRecipientPasswordUseCase } from '@/domain/account/application/use-cases/change-recipient-password'
import { CreateAdminUseCase } from '@/domain/account/application/use-cases/create-admin'
import { CreateDeliverymanUseCase } from '@/domain/account/application/use-cases/create-deliveryman'
import { CreateRecipientUseCase } from '@/domain/account/application/use-cases/create-recipient'
import { DeleteDeliverymanUseCase } from '@/domain/account/application/use-cases/delete-deliveryman'
import { DeleteRecipientUseCase } from '@/domain/account/application/use-cases/delete-recipient'
import { EditDeliverymanUseCase } from '@/domain/account/application/use-cases/edit-deliveryman'
import { EditRecipientUseCase } from '@/domain/account/application/use-cases/edit-recipient'
import { GetDeliverymanUseCase } from '@/domain/account/application/use-cases/get-deliveryman'
import { GetRecipientUseCase } from '@/domain/account/application/use-cases/get-recipient'
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
import { ServicesModule } from '../services/services.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller'
import { AuthenticateRecipientController } from './controllers/authenticate-recipient.controller'
import { ChangeDeliverymanPasswordController } from './controllers/change-deliveryman-password.controller'
import { ChangeRecipientPasswordController } from './controllers/change-recipient-password.controller'
import { CreateAdminController } from './controllers/create-admin.controller'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeliverOrderController } from './controllers/deliver-order.controller'
import { EditDeliverymanController } from './controllers/edit-deliveryman.controller'
import { EditOrderController } from './controllers/edit-order.controller'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { FetchCustomerOrdersController } from './controllers/fetch-customer-orders.controller'
import { FetchDeliverymanOrdersController } from './controllers/fetch-deliveryman-orders.controller'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { GetDeliverymanController } from './controllers/get-deliveryman.controller'
import { GetOrderController } from './controllers/get-order.controller'
import { GetRecipientController } from './controllers/get-recipient.controller'
import { PostOrderController } from './controllers/post-order.controller'
import { ReturnOrderController } from './controllers/return-order.controller'
import { UploadImageController } from './controllers/upload-image.controller'
import { WithdrawOrderController } from './controllers/withdraw-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, ServicesModule, StorageModule],
  controllers: [
    AuthenticateAdminController,
    AuthenticateDeliverymanController,
    AuthenticateRecipientController,
    ChangeDeliverymanPasswordController,
    ChangeRecipientPasswordController,
    CreateAdminController,
    CreateDeliverymanController,
    CreateOrderController,
    CreateRecipientController,
    DeleteDeliverymanController,
    DeleteRecipientController,
    DeleteOrderController,
    DeliverOrderController,
    EditDeliverymanController,
    EditRecipientController,
    EditOrderController,
    FetchCustomerOrdersController,
    FetchDeliverymanOrdersController,
    FetchNearbyOrdersController,
    GetDeliverymanController,
    GetRecipientController,
    GetOrderController,
    PostOrderController,
    ReturnOrderController,
    UploadImageController,
    WithdrawOrderController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    AuthenticateDeliverymanUseCase,
    AuthenticateRecipientUseCase,
    ChangeDeliverymanPasswordUseCase,
    ChangeRecipientPasswordUseCase,
    CreateAdminUseCase,
    CreateDeliverymanUseCase,
    CreateOrderUseCase,
    CreateRecipientUseCase,
    DeleteDeliverymanUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
    DeliverOrderUseCase,
    EditDeliverymanUseCase,
    EditRecipientUseCase,
    EditOrderUseCase,
    FetchCustomerOrdersUseCase,
    FetchDeliverymanOrdersUseCase,
    FetchNearbyOrdersUseCase,
    GetDeliverymanUseCase,
    GetRecipientUseCase,
    GetOrderUseCase,
    PostOrderUseCase,
    ReturnOrderUseCase,
    UploadAndCreateImageUseCase,
    WithdrawOrderUseCase,
  ],
})
export class HttpModule {}
