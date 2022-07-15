export interface User {
  id: string;
  properties: {
    // 一项属性
    name: string;
    value: string;
  }[];
}

export interface Profile {
  /** A no-dash UUID */
  id: string;
  name: string;

  properties: {
    name: string;
    value: string;
    signature?: string;
  }[];
}

export interface Texture {
  /** Milliseconds since Unix epoch, i.e. `Date.now()` */
  timestamp: number;
  profileId: string;
  profileName: string;

  textures: {
    skin: {
      url: string;

      metadata: {
        model: 'default' | 'slim';
      };
    };
  };
}
