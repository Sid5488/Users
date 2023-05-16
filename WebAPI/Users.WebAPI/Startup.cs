using System;
using System.IO;
using System.Reflection;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Users.WebAPI.Data;
using Users.WebAPI.Repositories;
using Users.WebAPI.Services;
using Users.WebAPI.Tools;
using Microsoft.IdentityModel.Tokens;

namespace Users.WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(
               context => context.UseSqlite(Configuration.GetConnectionString("Default"))
            );

            services.AddControllers()
                .AddNewtonsoftJson(
                    option => option.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore
                );

            services.AddCors(opt =>
            {
                opt.AddPolicy("AllowOrigin", policy => policy.AllowAnyOrigin());
                opt.AddPolicy("AllowHeader", policy => policy.AllowAnyHeader());
                opt.AddPolicy("AllowMethod", policy => policy.AllowAnyMethod());
                opt.AddPolicy("AllowCredentials", policy => policy.AllowCredentials());
            });

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IRepository, Repository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();

            var key = Encoding.ASCII.GetBytes(Settings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddVersionedApiExplorer(options =>
                {
                    options.GroupNameFormat = "'v'VVV";
                    options.SubstituteApiVersionInUrl = true;
                })
                .AddApiVersioning(options =>
                {
                    options.AssumeDefaultVersionWhenUnspecified = true;
                    options.DefaultApiVersion = new ApiVersion(1, 0);
                    options.ReportApiVersions = true;
                });

            var apiProviderDescription = services.BuildServiceProvider()
                .GetService<IApiVersionDescriptionProvider>();

            services.AddSwaggerGen(options =>
            {
                foreach (var description in apiProviderDescription.ApiVersionDescriptions)
                {
                    options.SwaggerDoc(
                        description.GroupName,
                        new Microsoft.OpenApi.Models.OpenApiInfo()
                        {
                            Title = "User WebAPI",
                            Version = description.ApiVersion.ToString(),
                            TermsOfService = new Uri("http://SeusTermosDeUso.com"),
                            Description = "API to read/write and authenticate users",
                            License = new Microsoft.OpenApi.Models.OpenApiLicense
                            {
                                Name = "UserWebAPI License",
                                Url = new Uri("https://opensource.org/license/mit/")
                            },
                            Contact = new Microsoft.OpenApi.Models.OpenApiContact
                            {
                                Name = "Guilherme Sousa",
                                Email = "guilhermenoobsaibot@gmail.com",
                                Url = new Uri("https://www.linkedin.com/in/guisousa/")
                            }
                        }
                    );
                }

                var xmlCommentsFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlCommentsFullPath = Path.Combine(AppContext.BaseDirectory, xmlCommentsFile);

                options.IncludeXmlComments(xmlCommentsFile);
            });
        }

        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            IApiVersionDescriptionProvider apiVersionDescriptionProvider
        )
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(options =>
            {
                options.AllowAnyOrigin();
                options.AllowAnyHeader();
                options.AllowAnyMethod();
            });

            app.UseSwagger()
                .UseSwaggerUI(options =>
                {
                    foreach (var description in apiVersionDescriptionProvider.ApiVersionDescriptions)
                    {
                        options.SwaggerEndpoint(
                            $"/swagger/{description.GroupName}/swagger.json",
                            description.GroupName.ToUpperInvariant()
                        );
                    }
                    options.RoutePrefix = "";
                });

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
