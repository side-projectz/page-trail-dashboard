'use client';

import { IUser } from '@/lib/interface';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const UserAvatar = ({ user }: {user: IUser}) => {
  const u = user;

  return (
    <div className="cursor-pointer">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar key={u.id}>
            <AvatarImage src={u?.image} />
            <AvatarFallback>
              {(u?.name || u?.email)
                .toUpperCase()
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>

        <HoverCardContent
          className="HoverCardContent"
          sideOffset={5}
          style={{ width: 'auto' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <Avatar style={{ width: '70px', height: '70px' }} key={u.id}>
                <AvatarImage src={u?.image} />
                <AvatarFallback>
                  {(u?.name || u?.email)
                    .toUpperCase()
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-medium">{u?.name}</div>
                <div className="text-gray-500">{u?.email}</div>
              </div>
            </div>
          </div>

        </HoverCardContent>

      </HoverCard>
    </div>
  );
};

export default UserAvatar;