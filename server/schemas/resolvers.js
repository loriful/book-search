const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    getSingleUser: async (parent, args) => {
      return User.findOne({
        $or: [{ _id: args._id }, { username: args.username }]})
        .select('-__v -password')
        .populate('savedBooks');
    }
  },

  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      
      if (!user) {
        return 'Something is wrong!';
      }
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, args) => {
      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        console.log('this before book create');
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        console.log('this after book create');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;
