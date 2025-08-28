const database = require('./db');

async function getAllPosts(){
  try {
    const { rows } = await database.query("SELECT post.id, first_name, last_name, handle, title, content, TO_CHAR(timestamp, 'Month DD, HH24:MI') AS timestamp FROM post JOIN user_list ON user_id = user_list.id;");

    return rows
  } catch (err) {
    console.error(err);
  }
}

async function createUser(firstName, lastName, handle, username, password){
  const text = 'INSERT INTO user_list (first_name, last_name, handle, username, password, is_member) VALUES ($1, $2, $3, $4, $5, $6)';
  const params = [firstName, lastName, '@'+handle, username, password, false];
  try {
    await database.query(text, params);
  } catch (e) {
    console.error(e);
  }
};

async function createPost(id, title, content){
  const text = `
    INSERT INTO post (title, content, user_id)
    VALUES ( $1, $2, $3 );
  `;
  const params = [title, content, id];
  try {
    await database.query(text, params);
  } catch (err) {
    console.error(err);
  }
}

async function deletePost(id){
  const text = 'DELETE FROM post WHERE id = $1';
  const params = [id];
  try {
    await database.query(text, params);
  } catch (err) {
    console.error(err)
  }
}

async function queryByAuthor(author){
  const params = [`%${author}%`];
  const text = "SELECT post.id, first_name, last_name, title, content, TO_CHAR(timestamp, 'Month DD, HH24:MI') AS timestamp FROM post JOIN user_list l ON user_id = l.id WHERE l.first_name ILIKE $1 OR l.last_name ILIKE $1 OR l.username ILIKE $1;";

  try {
    const { rows } = await database.query(text, params);
    return rows
  } catch (err) {
    console.log('query: ', text);
    console.log('params: ', params)
    console.error(err)
  }
}

async function queryByPostDate(precision, date){
  const textEqual = "SELECT post.id, first_name, last_name, title, content, TO_CHAR(timestamp, 'Month DD, HH24:MI') AS timestamp FROM post JOIN user_list ON user_id = user_list.id WHERE TO_CHAR(timestamp, 'yyyy-mm-dd') = $1;";
  const textLesserThan = "SELECT post.id, first_name, last_name, title, content, TO_CHAR(timestamp, 'Month DD, HH24:MI') AS timestamp FROM post JOIN user_list ON user_id = user_list.id WHERE TO_CHAR(timestamp, 'yyyy-mm-dd') < $1;";
  const textGreaterThan = "SELECT post.id, first_name, last_name, title, content, TO_CHAR(timestamp, 'Month DD, HH24:MI') AS timestamp FROM post JOIN user_list ON user_id = user_list.id WHERE TO_CHAR(timestamp, 'yyyy-mm-dd') > $1;";
  let text;
  switch (precision) {
    case 'equal':
      text = textEqual;
      break;
    case 'earlier':
      text = textLesserThan;
      break;
    case 'later':
      text = textGreaterThan;
      break;
    default:
      throw new Error('Undexpected input');
  }
  const params = [date];

  // console.log('params: ', params.map(a => a));
  console.log('query: ', text.replace('$1', params[0]));
  try {
    const { rows } = await database.query(text, params);
    console.log('rows: ', rows);

    return rows
  } catch(err){
    console.log('query: ', text.replace('$1', params[0]));
    console.log('params: ', params);
    console.error(err);
  }
}

async function queryByPostTitle(post_title){
  const text = "SELECT post.id, first_name, last_name, title, content, TO_CHAR(timestamp, 'Month DD, HH24:MI') AS timestamp FROM post JOIN user_list ON user_id = user_list.id WHERE title ILIKE $1;";

  try {
    const { rows } = await database.query(text, [`%${post_title}%`])

    return rows
  } catch(err){
    console.error(err);
  }
}

async function switchIsMember(id){
  try {
    const text = `SELECT * FROM user_list WHERE id = $1`;
    const params = [id];

    const { rows } = await database.query(text, params);
    const user_id = rows[0].id;

    const oppBool = !rows[0].is_member;
    const switchText = `UPDATE user_list SET is_member = '${oppBool}'`;

    await database.query(switchText);
  } catch (err) {
    console.error(err);
  }
}

async function switchIsAdmin(id){
  try {
    const text = `SELECT * FROM user_list WHERE id = $1`;
    const params = [id];

    const { rows } = await database.query(text, params);
    const user_id = rows[0].id;

    const oppBool = !rows[0].is_admin;
    const switchText = `UPDATE user_list SET is_admin = '${oppBool}'`;

    await database.query(switchText);
  } catch (err) {
    console.error(err);
  }
}

async function verifyDuplicate_handle(handle){
  const text = 'SELECT * FROM user_list WHERE handle = $1';
  const params = [handle];

  const { rows } = await database.query(text, params);

  return rows;
}

async function verifyDuplicate_username(username){
  const text = 'SELECT * FROM user_list WHERE username = $1';
  const params = [username];

  const { rows } = await database.query(text, params);

  return rows;
}

async function verifyDuplicate_password(password){
  const text = 'SELECT * FROM user_list WHERE password = $1';
  const params = [password];

  const { rows } = await database.query(text, params);

  return rows;
}

async function updateUser(id, first_name, last_name, handle, username, password){
  console.log('args: ', {
    id, first_name, last_name, handle, username, password
  });

  const text = `UPDATE user_list 
  SET 
  first_name = $2,
  last_name = $3,
  handle = $4,
  username = $5,
  password = $6
  WHERE id = $1;
  `;
  const params = [id, first_name, last_name, '@'+handle, username, password];

  try {
    await database.query(text, params);
  } catch (err) {
    console.error(err);
  }
}

const db = {
  createUser,
  createPost,
  getAllPosts,
  deletePost,
  queryByAuthor,
  queryByPostTitle,
  queryByPostDate,
  switchIsMember,
  switchIsAdmin,
  verifyDuplicate_handle,
  verifyDuplicate_username,
  verifyDuplicate_password,
  updateUser
}

module.exports = db