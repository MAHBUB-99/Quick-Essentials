import * as Dialog from '@radix-ui/react-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { TextareaField } from '@/components/forms/Field';

const schema = z.object({
  rating: z.coerce.number().min(1, 'Choose a rating').max(5),
  comment: z.string().min(10, 'Write at least 10 characters'),
});
type Values = z.infer<typeof schema>;

export function ReviewPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { rating: 0, comment: '' } });
  const rating = watch('rating');
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setSent(true);
  };
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) void navigate(-1);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 shadow-2xl dark:bg-gray-800">
          <Dialog.Title className="text-2xl font-semibold">Write a Review</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Tell others about the quality of your order.
          </Dialog.Description>
          {sent ? (
            <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800">
              Thanks! Your review has been submitted.
            </div>
          ) : (
            <form onSubmit={(event) => void handleSubmit(submit)(event)} className="mt-6 space-y-5">
              <fieldset>
                <legend className="mb-2 font-medium">Rate this product</legend>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="cursor-pointer text-2xl text-yellow-400">
                      <input
                        type="radio"
                        value={value}
                        className="sr-only"
                        {...register('rating')}
                      />
                      <Icon name={value <= Number(rating) ? 'star' : 'starRegular'} />
                    </label>
                  ))}
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                )}
              </fieldset>
              <TextareaField
                id="review-comment"
                label="Comment"
                rows={4}
                error={errors.comment?.message}
                {...register('comment')}
              />
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                Submit Review
              </Button>
            </form>
          )}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 p-2 text-gray-500"
              aria-label="Close review dialog"
            >
              <Icon name="times" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
