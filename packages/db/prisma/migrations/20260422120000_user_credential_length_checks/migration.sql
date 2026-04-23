ALTER TABLE "User" ADD CONSTRAINT "User_email_len_chk" CHECK (char_length("email") >= 5 AND char_length("email") <= 254);
ALTER TABLE "User" ADD CONSTRAINT "User_username_len_chk" CHECK (char_length("username") >= 2 AND char_length("username") <= 25);
ALTER TABLE "User" ADD CONSTRAINT "User_hashed_password_len_chk" CHECK (char_length("hashedPassword") = 60);
