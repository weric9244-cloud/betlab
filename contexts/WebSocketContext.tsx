'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

interface WebSocketContextType {
  socket: WebSocket | null;
  liveMatches: any[];
  matchUpdates: any;
  subscribeToMatch: (matchId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [matchUpdates, setMatchUpdates] = useState<any>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const shouldReconnectRef = useRef(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      // Don't create multiple connections
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setSocket(wsRef.current);
        return;
      }

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setSocket(ws);
        // Clear any pending reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = undefined;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'live_matches':
              setLiveMatches(data.data || []);
              break;
            case 'score_update':
              setMatchUpdates((prev: any) => ({
                ...prev,
                [data.matchId]: {
                  score: data.score,
                  events: data.events
                }
              }));
              break;
            case 'odds_update':
              setMatchUpdates((prev: any) => ({
                ...prev,
                [data.matchId]: {
                  odds: data.odds
                }
              }));
              break;
            case 'match_finished':
              setMatchUpdates((prev: any) => ({
                ...prev,
                [data.matchId]: {
                  status: 'finished',
                  match: data.match
                }
              }));
              break;
            case 'match_started':
              setMatchUpdates((prev: any) => ({
                ...prev,
                [data.matchId]: {
                  status: 'live',
                  match: data.match
                }
              }));
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setSocket(null);
        wsRef.current = null;
        
        // Reconnect after 3 seconds if should reconnect
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const subscribeToMatch = (matchId: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'subscribe_match',
        matchId
      }));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        liveMatches,
        matchUpdates,
        subscribeToMatch
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

