import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.js'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()
    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
