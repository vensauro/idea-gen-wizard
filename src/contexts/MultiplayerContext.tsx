import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DbConnection, tables, reducers } from '../spacetime/index';
import { User, Room } from '../spacetime/types';
import { Identity } from "spacetimedb";

interface MultiplayerContextType {
  connected: boolean;
  identity: Identity | null;
  me: User | null;
  room: Room | null;
  users: User[];
  createRoom: (teamName: string, userName: string) => void;
  joinRoom: (roomId: string, userName: string) => void;
  updateRoomData: (formData: any) => void;
  leaveRoom: () => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

export function MultiplayerProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [connection, setConnection] = useState<DbConnection | null>(null);

  useEffect(() => {
    let token = localStorage.getItem('stdb_token') || undefined;
    
    // SpacetimeDB builder can accept both https and wss for URI.
    const conn = DbConnection.builder()
      .withUri(import.meta.env.VITE_SPACETIMEDB_URI || 'https://maincloud.spacetimedb.com')
      .withDatabaseName(import.meta.env.VITE_SPACETIMEDB_NAME || 'idea-gen-wizard-db');
      
    if (token) {
      conn.withToken(token);
    }

    const dbConn = conn.onConnect((c, id, receivedToken) => {
        setConnected(true);
        setIdentity(id);
        localStorage.setItem('stdb_token', receivedToken);
      })
      .onDisconnect(() => {
        setConnected(false);
      })
      .onConnectError((_c, err) => {
        console.error("SpacetimeDB connect error:", err);
        if (err.message?.includes("401") || err.message?.includes("token")) {
          localStorage.removeItem('stdb_token');
        }
      })
      .build();

    setConnection(dbConn);

    const syncState = () => {
      setUsers([...dbConn.db.user.iter()]);
    };

    dbConn.db.user.onInsert(syncState);
    dbConn.db.user.onUpdate(syncState);
    dbConn.db.user.onDelete(syncState);
    dbConn.db.room.onInsert(syncState);
    dbConn.db.room.onUpdate(syncState);
    dbConn.db.room.onDelete(syncState);

    return () => {
      dbConn.disconnect();
    };
  }, []);

  const me = identity ? users.find(u => u.identity.isEqual(identity)) || null : null;
  
  useEffect(() => {
    if (!connection || !identity) return;
    
    const handle = connection.subscriptionBuilder()
      .onApplied(() => {
        setUsers([...connection.db.user.iter()]);
      })
      .subscribe([`SELECT * FROM user WHERE identity = 0x${identity.toHexString()}`]);
      
    return () => {
      handle.unsubscribe();
    };
  }, [connection, identity]);

  useEffect(() => {
    if (!connection || !me?.roomId) return;
    
    const handle = connection.subscriptionBuilder()
      .onApplied(() => {
        setUsers([...connection.db.user.iter()]);
      })
      .subscribe([
        `SELECT * FROM user WHERE room_id = '${me.roomId}'`,
        `SELECT * FROM room WHERE id = '${me.roomId}'`
      ]);
      
    return () => {
      handle.unsubscribe();
    };
  }, [connection, me?.roomId]);

  useEffect(() => {
    if (me && me.roomId && connection) {
      const dbRoom = [...connection.db.room.iter()].find(r => r.id === me.roomId);
      setRoom(dbRoom || null);
    } else {
      setRoom(null);
    }
  }, [me, users, connection]);

  const roomUsers = room ? users.filter(u => u.roomId === room.id) : [];

  const handleCreateRoom = (teamName: string, userName: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    connection?.reducers.createRoom({ roomId, teamName, userName });
  };

  const handleJoinRoom = (roomId: string, userName: string) => {
    connection?.reducers.joinRoom({ roomId, userName });
  };

  const handleUpdateRoomData = (formData: any) => {
    if (me && me.isHost && me.roomId && room) {
      connection?.reducers.updateFormData({ roomId: me.roomId, formData: JSON.stringify(formData) });
    }
  };

  const handleLeaveRoom = () => {
    window.location.reload();
  };

  return (
    <MultiplayerContext.Provider value={{
      connected,
      identity,
      me,
      room,
      users: roomUsers,
      createRoom: handleCreateRoom,
      joinRoom: handleJoinRoom,
      updateRoomData: handleUpdateRoomData,
      leaveRoom: handleLeaveRoom
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
}

export function useMultiplayer() {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
}
