/* eslint-disable import/prefer-default-export */
import {
  PrismaClient,
  User,
  Project,
  UsersOnProjects,
  Backlog,
  Sprint,
  BacklogPriority,
  BacklogType,
} from '@prisma/client';
import bcrypt from 'bcrypt';

type BacklogDataType = {
  backlog_id: number;
  points: number | null;
  description: string | null;
  assignee?:
    | {
        connect: {
          project_id_user_id: {
            user_id: number;
            project_id: number;
          };
        };
      }
    | undefined;
  priority: BacklogPriority | null;
  reporter: {
    connect: {
      project_id_user_id: {
        user_id: number;
        project_id: number;
      };
    };
  };
  sprint?:
    | {
        connect: {
          id: number;
        };
      }
    | undefined;
  summary: string;
  type: BacklogType;
  backlogStatus: {
    connect: {
      project_id_name: {
        project_id: number;
        name: string;
      };
    };
  };
};

async function createUsersForBacklogSeed(prisma: PrismaClient) {
  const usersToCreate: User[] = [
    {
      user_id: 901,
      user_email: 'testBacklogUser1@test.com',
      user_password_hash: bcrypt.hashSync('testPassword', 10),
    },
    {
      user_id: 902,
      user_email: 'testBacklogUser2@test.com',
      user_password_hash: bcrypt.hashSync('testPassword', 10),
    },
  ];

  await Promise.all(
    usersToCreate.map(async (userToCreate) => {
      const user: User = await prisma.user.create({
        data: userToCreate,
      });
      console.log('created user %s', user);
    }),
  );
}

async function createUsersOnRolesForBacklogSeed(prisma: PrismaClient) {
  const userRoles = await prisma.usersOnRoles.createMany({
    data: [
      {
        user_email: 'testBacklogUser1@test.com',
        role_id: 1,
      },
      {
        user_email: 'testBacklogUser2@test.com',
        role_id: 2,
      },
    ],
  });

  console.log('created usersOnRoles %s', userRoles);
}

async function createProjectForBacklogSeed(prisma: PrismaClient) {
  const project: Project = await prisma.project.create({
    data: {
      id: 903,
      pname: 'Backlog test project',
      backlogStatuses: {
        createMany: {
          data: [
            { name: 'To do', type: 'todo', order: 1 },
            { name: 'In progress', type: 'in_progress', order: 1 },
            { name: 'Done', type: 'done', order: 1 },
          ],
        },
      },
    },
  });

  console.log('created project %s', project);
}

async function createUsersOnProjectForBacklogSeed(prisma: PrismaClient) {
  const usersToAdd = [
    {
      user_id: 901,
      project_id: 903,
    },
    {
      user_id: 902,
      project_id: 903,
    },
  ];
  await Promise.all(
    usersToAdd.map(async (userToAdd) => {
      const userOnProject: UsersOnProjects = await prisma.usersOnProjects.create({
        data: userToAdd,
      });
      console.log('created userOnProject %s', userOnProject);
    }),
  );
}

async function createSprintForBacklogSeed(prisma: PrismaClient) {
  const sprint: Sprint = await prisma.sprint.create({
    data: {
      id: 901,
      name: 'Sprint 1',
      duration: 1,
      project_id: 903,
      start_date: new Date('Sun Oct 09 2022 15:03:56 GMT+0800 (Singapore Standard Time)'),
      end_date: new Date('Sun Oct 16 2022 15:03:56 GMT+0800 (Singapore Standard Time)'),
    },
  });
  console.log('created sprint %s', sprint);
}

async function createBacklogsSeed(prisma: PrismaClient) {
  const backlogsToAdd: BacklogDataType[] = [
    {
      backlog_id: 1,
      summary: 'Test Story Backlog 1',
      type: 'story',
      sprint: {
        connect: {
          id: 901,
        },
      },
      priority: 'very_high',
      reporter: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      assignee: {
        connect: {
          project_id_user_id: {
            user_id: 902,
            project_id: 903,
          },
        },
      },
      points: 2,
      description: 'Test desc',
      backlogStatus: {
        connect: {
          project_id_name: {
            project_id: 903,
            name: 'To do',
          },
        },
      },
    },
    {
      backlog_id: 2,
      summary: 'Test Story Backlog 2',
      type: 'story',
      sprint: {
        connect: {
          id: 901,
        },
      },
      priority: 'high',
      reporter: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      assignee: {
        connect: {
          project_id_user_id: {
            user_id: 902,
            project_id: 903,
          },
        },
      },
      points: 2,
      description: 'Test desc 2',
      backlogStatus: {
        connect: {
          project_id_name: {
            project_id: 903,
            name: 'To do',
          },
        },
      },
    },
    {
      backlog_id: 3,
      summary: 'Test Task Backlog 1',
      type: 'task',
      sprint: {
        connect: {
          id: 901,
        },
      },
      priority: 'medium',
      reporter: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      assignee: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      points: 1,
      description: 'Test desc 3',
      backlogStatus: {
        connect: {
          project_id_name: {
            project_id: 903,
            name: 'To do',
          },
        },
      },
    },
    {
      backlog_id: 4,
      summary: 'Test Bug Backlog 1',
      type: 'bug',
      sprint: {
        connect: {
          id: 901,
        },
      },
      priority: 'low',
      reporter: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      assignee: {
        connect: {
          project_id_user_id: {
            user_id: 902,
            project_id: 903,
          },
        },
      },
      points: 3,
      description: 'Test desc 4',
      backlogStatus: {
        connect: {
          project_id_name: {
            project_id: 903,
            name: 'To do',
          },
        },
      },
    },
    {
      backlog_id: 5,
      summary: 'Test Bug Backlog 2',
      type: 'bug',
      sprint: {
        connect: {
          id: 901,
        },
      },
      priority: 'very_low',
      reporter: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      assignee: {
        connect: {
          project_id_user_id: {
            user_id: 901,
            project_id: 903,
          },
        },
      },
      points: 2,
      description: 'Test desc 5',
      backlogStatus: {
        connect: {
          project_id_name: {
            project_id: 903,
            name: 'To do',
          },
        },
      },
    },
  ];

  await Promise.all(
    backlogsToAdd.map(async (backlogToAdd) => {
      const backlog: Backlog = await prisma.backlog.create({
        data: backlogToAdd,
      });
      console.log('created backlog %s', backlog);
    }),
  );

  const project: Project = await prisma.project.update({
    where: { id: 903 },
    data: {
      backlog_counter: 5,
    },
  });
  console.log('updated project %s', project);
}

async function setupBacklogSeed(prisma: PrismaClient) {
  await createUsersForBacklogSeed(prisma);
  await createUsersOnRolesForBacklogSeed(prisma);
  await createProjectForBacklogSeed(prisma);
  await createUsersOnProjectForBacklogSeed(prisma);
  await createSprintForBacklogSeed(prisma);
  await createBacklogsSeed(prisma);
}

export { setupBacklogSeed };
