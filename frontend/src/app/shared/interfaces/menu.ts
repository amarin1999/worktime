import { ComponentType } from "@angular/cdk/portal";

export interface Menu {
  title: string;
  img: string;
  link: ComponentType<any> | string;
  type?: string;
}
