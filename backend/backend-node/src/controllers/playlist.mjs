import { consult } from "../database/database.mjs";

const create = async (req, res) => {};
const getall = async (req, res) => {};
const modify = async (req, res) => {};
const deletesong = async (req, res) => {};
const addsong = async (req, res) => {};
const removesong = async (req, res) => {};
const getsongs = async (req, res) => {};

export const playlist = {
  create,
  getall,
  modify,
  deletesong,
  addsong,
  removesong,
  getsongs,
};
