export interface DockerApp {
  Name: string;
  Description: string;
  "Source Code": string;
  License: string;
  Tag: string;
  ID: string;
  icon_url: string;
  docker_compose_url: string;
}

export interface AppConfig {
  [key: string]: string | number | boolean;
}

export interface ComposeUrlResponse {
  url: string;
}