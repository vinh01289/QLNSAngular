import { publishReplay } from "rxjs/operators";

export enum RequestApprovalTypeEnum {
  NP = "Nghỉ phép",
  NPKL = "Nghỉ không lương",
  DT = "Đi trễ",
  VS = "Về sớm",
  CT = "Công Tác",
  TS = "Thai Sản",
  NB = "Nghỉ Bệnh",
  NKH = "Nghỉ Kết Hôn",
}
