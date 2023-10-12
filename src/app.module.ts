import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { ProductServiceModule } from './product-service/product-service.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReservationModule } from './reservation/reservation.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PatientModule,
    DoctorModule,
    ProductServiceModule,
    TransactionModule,
    ReservationModule,
    PrismaModule,
  ],
})
export class AppModule {}
