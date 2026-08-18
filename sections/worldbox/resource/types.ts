export type ResourceType = "wood" | "food";

export type ResourceNode = {
  id: number;
  // type of resource
  type: ResourceType;
  x: number;
  z: number;
  amount: number;
};
