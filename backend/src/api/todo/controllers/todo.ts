import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::todo.todo', ({ strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user.id;

    const links = await strapi.db.connection
      .select('todo_id')
      .from('todos_users_permissions_user_lnk')
      .where('user_id', userId);

    const todoIds = links.map((l: any) => l.todo_id);

    if (todoIds.length === 0) {
      return { data: [] };
    }

    const todos = await strapi.db.connection
      .select('*')
      .from('todos')
      .whereIn('id', todoIds);

    const mapped = todos.map((t: any) => ({
      id: t.id,
      documentId: t.document_id,
      title: t.title,
      isCompleted: t.is_completed === 1 || t.is_completed === true,
    }));

    return { data: mapped };
  },

  async create(ctx) {
    const userId = ctx.state.user.id;
    const body = ctx.request.body as any;

    const todo = await strapi.entityService.create('api::todo.todo', {
      data: {
        title: body.data.title,
        isCompleted: false,
      },
    }) as any;

    await strapi.db.connection
      .insert({ todo_id: todo.id, user_id: userId, todo_ord: 1 })
      .into('todos_users_permissions_user_lnk');

    return {
      data: {
        id: todo.id,
        documentId: todo.documentId,
        title: todo.title,
        isCompleted: false,
      }
    };
  },

  async update(ctx) {
    return await super.update(ctx);
  },

  async delete(ctx) {
    return await super.delete(ctx);
  },
}));