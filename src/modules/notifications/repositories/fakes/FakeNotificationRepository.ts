import { getMongoRepository, MongoRepository } from 'typeorm';
import {ObjectID} from 'mongodb';

import Notification from '../../infra/typeorm/schemas/Notification';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationRepository implements INotificationRepository{
  private notifications: Notification[] = [];

  public async create({content, recipient_id}: ICreateNotificationDTO): Promise<Notification>{
    const notification = new Notification();

    Object.assign(notification, {content, recipient_id: new ObjectID})
    this.notifications.push(notification);

    return notification;
  }
}

export default NotificationRepository;
