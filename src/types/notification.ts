export type NotiId = number & {};
export type ConversationId = string & {};
export type TopicId = number & {};

export type MessageNotification = {
    NotiId: NotiId;
    NotiTime: Date;
    ConversationId: ConversationId;
    TopicId: TopicId;
    ContentType: "Message";
    Content: string;
};

export type PhotoNotification = {
    NotiId: NotiId;
    NotiTime: Date;
    ConversationId: ConversationId;
    TopicId: TopicId;
    ContentType: "Photo";
    Content: string;
};

export type GrafanaNotification = {
    NotiId: NotiId;
    NotiTime: Date;
    ConversationId: ConversationId;
    TopicId: TopicId;
    ContentType: "Grafana";
    Content: string;
};

export type Notification = MessageNotification | PhotoNotification | GrafanaNotification;
