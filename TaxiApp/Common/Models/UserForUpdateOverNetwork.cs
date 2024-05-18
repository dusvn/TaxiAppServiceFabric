using Common.DTO;
using Common.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using static Common.Enums.VerificationStatus;

namespace Common.Models
{
    [DataContract]
    public class UserForUpdateOverNetwork
    {

        [DataMember]
        public string Address { get; set; }

        [DataMember]
        public DateTime Birthday { get; set; }

        [DataMember]
        public string Email { get; set; }


        [DataMember]
        public string FirstName { get; set; }

        [DataMember]
        public string LastName { get; set; }

        [DataMember]
        public string Username { get; set; }

        [DataMember]
        public FileUploadDTO ImageFile { get; set; }

        [DataMember]
        public string Password { get; set; }

        [DataMember]
        public string PreviousEmail { get; set; }

        public UserForUpdateOverNetwork(UserForUpdate user)
        {
            PreviousEmail = user.PreviousEmail;

            if(user.Address != null) Address = user.Address;

            if(user.Birthday != null) Birthday = DateTime.ParseExact(user.Birthday, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            else Birthday = DateTime.MinValue;

            if(user.Email != null) Email = user.Email;

            if(user.FirstName != null) FirstName = user.FirstName;
            if(user.FirstName !=null) LastName = user.LastName;

            if(user.LastName != null) Username = user.Username;
            if(user.ImageUrl.Length>0) ImageFile = makeFileOverNetwork(user.ImageUrl);

            if(user.Password!=null) Password = user.Password;

        }

        public FileUploadDTO makeFileOverNetwork(IFormFile file)
        {
            FileUploadDTO fileOverNetwork;

            using (var stream = file.OpenReadStream())
            {
                byte[] fileContent;
                using (var memoryStream = new MemoryStream())
                {
                    stream.CopyTo(memoryStream);
                    fileContent = memoryStream.ToArray();
                }

                fileOverNetwork = new FileUploadDTO(file.FileName, file.ContentType, fileContent);
            }

            return fileOverNetwork;
        }
    }
}
