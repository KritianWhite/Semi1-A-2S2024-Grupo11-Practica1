import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from config import config

def uploadImageS3(buff, path):
    # Configuración del cliente S3
    s3_client = boto3.client(
        's3',
        region_name = config["region"], 
        aws_access_key_id = config["accessKeyId"],
        aws_secret_access_key = config["secretAccessKey"]
    )

    try:
        # Subir la imagen a S3
        response = s3_client.put_object(
            Bucket= config["bucket"],
            Key=path,
            Body=buff,
            ContentType='image/jpeg'
        )
        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error de credenciales:", e)
        return None
    except Exception as e:
        print("Error al subir la imagen:", e)
        return None
  
def uploadMP3S3(buff, path):
    # Configuración del cliente S3
    s3_client = boto3.client(
        's3',
        region_name = config["region"], 
        aws_access_key_id = config["accessKeyId"],
        aws_secret_access_key = config["secretAccessKey"]
    )

    try:
        # Subir la imagen a S3
        response = s3_client.put_object(
            Bucket= config["bucket"],
            Key=path,
            Body=buff,
            ContentType='audio/mpeg'
        )
        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error de credenciales:", e)
        return None
    except Exception as e:
        print("Error al subir la imagen:", e)
        return None

def deleteObjectS3(path):

    parts = path.split('/')
    parts = parts[-2] + "/" + parts[-1]

    # Configuración del cliente S3
    s3_client = boto3.client(
        's3',
        region_name = config["region"], 
        aws_access_key_id = config["accessKeyId"],
        aws_secret_access_key = config["secretAccessKey"]
    )

    try:
        # Eliminar el objeto de S3
        response = s3_client.delete_object(
            Bucket= config["bucket"],
            Key=parts
        )
        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error de credenciales:", e)
        return None
    except Exception as e:
        print("Error al eliminar objeto:", e)
        return None