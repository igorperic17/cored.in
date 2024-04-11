import { tags } from "typia";

export type SmallPositiveNumber = number & tags.Minimum<0> & tags.Maximum<999>;
export type PositiveNumber = number & tags.Minimum<0> & tags.Maximum<99999999>;

export type ShortString = string & tags.MinLength<1> & tags.MaxLength<99>;

export type DateString = string &
  tags.Pattern<"((?:19|20)\\d\\d)-(0?[1-9]|1[012])-([12][0-9]|3[01]|0?[1-9])">;

export type SpanishPostalCodeString = string &
  tags.Pattern<"[0-9]{5,5}"> &
  tags.MaxLength<5>;
