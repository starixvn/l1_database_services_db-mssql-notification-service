export type MessageNotification = {
    NotiId: number;
    NotiTime: Date;
    ConversationId: string;
    ContentType: "Message";
    Content: string;
};

export type PhotoNotification = {
    NotiId: number;
    NotiTime: Date;
    ConversationId: string;
    ContentType: "Photo";
    Content: string;
};

export type GrafanaNotification = {
    NotiId: number;
    NotiTime: Date;
    ConversationId: string;
    ContentType: "Grafana";
    Content: string;
};

export type Notification = MessageNotification | PhotoNotification | GrafanaNotification;
