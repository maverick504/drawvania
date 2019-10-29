# Setup basic roles

Start adonis repl to manage the database via command line:
```
adonis repl
```

Create an admin role:
```
const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')

const  roleAdmin  =  new  Role()
roleAdmin.name  =  'Administrator'
roleAdmin.slug  =  'administrator'
roleAdmin.description  =  'manage administration privileges'
await  roleAdmin.save()
```

Attach the admin role to an user:
```
const  user  =  await  User.find(1)
await  user.roles().attach([roleAdmin.id])
```
